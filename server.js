import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 30 });

// Middleware
app.use(cors());
app.use(express.json());

// API client configuration
const nearBlocksAPI = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Error handler middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper function to convert yoctoNEAR to NEAR
const yoctoToNear = (yocto) => {
  return (parseFloat(yocto) / 1e24).toFixed(4);
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'NEAR Wallet Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

// Get account details
app.get('/api/account/:accountId', asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const cacheKey = `account_${accountId}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  try {
    const { data } = await nearBlocksAPI.get(`/account/${accountId}`);
    
    if (data && data.account && data.account[0]) {
      const account = data.account[0];
      const response = {
        account_id: account.account_id,
        balance: yoctoToNear(account.amount),
        balance_raw: account.amount,
        staked: yoctoToNear(account.locked || '0'),
        staked_raw: account.locked || '0',
        storage_used: account.storage_used || '0',
        block_height: account.block_height,
        block_hash: account.block_hash,
        created_at: account.created?.block_timestamp || null,
        deleted_at: account.deleted?.block_timestamp || null
      };
      
      cache.set(cacheKey, response);
      res.json(response);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Account not found' });
    } else {
      throw error;
    }
  }
}));

// Get account transactions with pagination
app.get('/api/account/:accountId/txns', asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const { page = 1, per_page = 25 } = req.query;
  const cacheKey = `txns_${accountId}_${page}_${per_page}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const { data } = await nearBlocksAPI.get(`/account/${accountId}/txns`, {
    params: { page, per_page }
  });

  if (data && data.txns) {
    const transactions = data.txns.map(tx => ({
      transaction_hash: tx.transaction_hash,
      signer_account_id: tx.signer_account_id,
      receiver_account_id: tx.receiver_account_id,
      block_height: tx.block?.block_height,
      block_timestamp: tx.block_timestamp,
      status: tx.outcomes?.status || false,
      deposit: yoctoToNear(tx.actions_agg?.deposit || '0'),
      transaction_fee: yoctoToNear(tx.outcomes_agg?.transaction_fee || '0'),
      actions_count: tx.actions?.length || 0,
      actions: tx.actions || []
    }));

    const response = {
      transactions,
      total: transactions.length,
      page: parseInt(page),
      per_page: parseInt(per_page)
    };

    cache.set(cacheKey, response);
    res.json(response);
  } else {
    res.json({ transactions: [], total: 0, page: parseInt(page), per_page: parseInt(per_page) });
  }
}));

// Get account tokens (FT and NFT)
app.get('/api/account/:accountId/tokens', asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const cacheKey = `tokens_${accountId}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const { data } = await nearBlocksAPI.get(`/account/${accountId}/tokens`);

  if (data && data.tokens) {
    const response = {
      fungible_tokens: data.tokens.fts || [],
      nfts: data.tokens.nfts || [],
      ft_count: (data.tokens.fts || []).length,
      nft_count: (data.tokens.nfts || []).length
    };

    cache.set(cacheKey, response);
    res.json(response);
  } else {
    res.json({ fungible_tokens: [], nfts: [], ft_count: 0, nft_count: 0 });
  }
}));

// Get specific FT token details
app.get('/api/account/:accountId/ft/:contractId', asyncHandler(async (req, res) => {
  const { accountId, contractId } = req.params;
  const cacheKey = `ft_${accountId}_${contractId}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const { data } = await nearBlocksAPI.get(`/account/${accountId}/tokens/${contractId}`);

  if (data && data.contracts && data.contracts[0]) {
    const token = data.contracts[0];
    const response = {
      contract: contractId,
      amount: token.amount || '0',
      decimals: token.ft?.decimals || 24,
      symbol: token.ft?.symbol || 'UNKNOWN',
      name: token.ft?.name || 'Unknown Token',
      icon: token.ft?.icon || null,
      price: token.ft?.price || null
    };

    cache.set(cacheKey, response);
    res.json(response);
  } else {
    res.status(404).json({ error: 'Token not found' });
  }
}));

// Get account inventory (detailed view)
app.get('/api/account/:accountId/inventory', asyncHandler(async (req, res) => {
  const { accountId } = req.params;
  const cacheKey = `inventory_${accountId}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const { data } = await nearBlocksAPI.get(`/account/${accountId}/inventory`);

  if (data && data.inventory) {
    const response = {
      fts: data.inventory.fts || [],
      nfts: data.inventory.nfts || []
    };

    cache.set(cacheKey, response);
    res.json(response);
  } else {
    res.json({ fts: [], nfts: [] });
  }
}));

// Get transaction details by hash
app.get('/api/txns/:txHash', asyncHandler(async (req, res) => {
  const { txHash } = req.params;
  const cacheKey = `tx_${txHash}`;
  
  // Check cache
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, cached: true });
  }

  const { data } = await nearBlocksAPI.get(`/txns/${txHash}`);

  if (data && data.txns && data.txns[0]) {
    const tx = data.txns[0];
    const response = {
      transaction_hash: tx.transaction_hash,
      signer_account_id: tx.signer_account_id,
      receiver_account_id: tx.receiver_account_id,
      status: tx.outcomes?.status || false,
      block_height: tx.block?.block_height,
      block_timestamp: tx.block_timestamp,
      deposit: yoctoToNear(tx.actions_agg?.deposit || '0'),
      transaction_fee: yoctoToNear(tx.outcomes_agg?.transaction_fee || '0'),
      actions: tx.actions || [],
      receipts: tx.receipts || []
    };

    cache.set(cacheKey, response);
    res.json(response);
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
}));

// Search accounts
app.get('/api/search', asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword || keyword.length < 2) {
    return res.status(400).json({ error: 'Keyword must be at least 2 characters' });
  }

  const { data } = await nearBlocksAPI.get('/search', {
    params: { keyword }
  });

  res.json(data);
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  if (err.response) {
    // API error response
    res.status(err.response.status || 500).json({
      error: err.response.data?.error || 'API Error',
      message: err.message,
      status: err.response.status
    });
  } else if (err.code === 'ECONNABORTED') {
    res.status(504).json({ error: 'Request timeout' });
  } else {
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NEAR Wallet Tracker API running on http://localhost:${PORT}`);
  console.log(`📊 API Base: ${process.env.API_BASE_URL}`);
  console.log(`⏱️  Cache TTL: ${process.env.CACHE_TTL}s`);
});


