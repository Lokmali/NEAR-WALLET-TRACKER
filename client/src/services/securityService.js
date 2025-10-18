// Security Analysis Service - Uses NEAR RPC (FREE, no API quota)

const NEAR_RPC_URL = 'https://rpc.mainnet.near.org';

// Known safe contracts and apps
const KNOWN_APPS = {
  'app.nearcrowd.near': { name: 'NearCrowd', safe: true },
  'mintbase1.near': { name: 'Mintbase', safe: true },
  'nft.paras.near': { name: 'Paras NFT', safe: true },
  'v2.ref-finance.near': { name: 'Ref Finance', safe: true },
  'token.sweat': { name: 'Sweat Economy', safe: true },
  'app.nearnft.near': { name: 'NEAR NFT', safe: true },
  'keypom.near': { name: 'Keypom', safe: true },
  'social.near': { name: 'NEAR Social', safe: true },
  'wallet.near': { name: 'NEAR Wallet', safe: true },
  'mynearwallet.near': { name: 'MyNearWallet', safe: true },
};

// Fetch access keys from NEAR RPC
export async function fetchAccessKeys(accountId) {
  try {
    const response = await fetch(NEAR_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_access_key_list',
          finality: 'final',
          account_id: accountId
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Failed to fetch access keys');
    }

    return data.result?.keys || [];
  } catch (error) {
    console.error('Error fetching access keys:', error);
    throw error;
  }
}

// Analyze key risk
function analyzeKeyRisk(key, index) {
  const issues = [];
  const warnings = [];
  const recommendations = [];
  
  const isFullAccess = key.access_key.permission === 'FullAccess';
  const isFunctionCall = typeof key.access_key.permission === 'object';
  
  // Parse public key to check age (approximate)
  const publicKey = key.public_key;
  
  // Full access key checks
  if (isFullAccess) {
    issues.push({
      severity: 'high',
      type: 'FULL_ACCESS',
      message: 'Full-access key detected',
      description: 'This key can perform any action on your account including transferring all funds.',
      action: 'Review if this key is still needed'
    });
    
    recommendations.push({
      title: 'Consider function-call keys',
      description: 'For dApps, use function-call keys instead of full-access keys for better security.',
      link: 'https://docs.near.org/concepts/basics/accounts/access-keys'
    });
  }
  
  // Function-call key checks
  if (isFunctionCall) {
    const permission = key.access_key.permission.FunctionCall;
    const receiverId = permission.receiver_id;
    const allowance = permission.allowance;
    const methodNames = permission.method_names;
    
    // Check if receiver is known
    const knownApp = KNOWN_APPS[receiverId];
    
    if (!knownApp) {
      warnings.push({
        severity: 'medium',
        type: 'UNKNOWN_CONTRACT',
        message: `Key for unknown contract: ${receiverId}`,
        description: 'This key has access to a contract that is not in our verified list.',
        action: 'Verify this contract is legitimate'
      });
    }
    
    // Check allowance
    if (allowance) {
      const allowanceNear = parseFloat(allowance) / 1e24;
      if (allowanceNear > 10) {
        warnings.push({
          severity: 'medium',
          type: 'HIGH_ALLOWANCE',
          message: `High allowance: ${allowanceNear.toFixed(2)} NEAR`,
          description: 'This key can spend a significant amount of NEAR.',
          action: 'Review if this allowance is necessary'
        });
      }
    } else {
      warnings.push({
        severity: 'low',
        type: 'UNLIMITED_ALLOWANCE',
        message: 'Unlimited allowance',
        description: 'This key has no spending limit.',
        action: 'Consider setting an allowance limit'
      });
    }
    
    // Check method restrictions
    if (methodNames.length === 0) {
      warnings.push({
        severity: 'low',
        type: 'NO_METHOD_RESTRICTION',
        message: 'No method restrictions',
        description: 'This key can call any method on the contract.',
        action: 'Consider restricting to specific methods'
      });
    }
  }
  
  return {
    publicKey: key.public_key,
    keyType: isFullAccess ? 'full-access' : 'function-call',
    isFullAccess,
    isFunctionCall,
    permission: key.access_key.permission,
    receiverId: isFunctionCall ? key.access_key.permission.FunctionCall.receiver_id : null,
    allowance: isFunctionCall ? key.access_key.permission.FunctionCall.allowance : null,
    methodNames: isFunctionCall ? key.access_key.permission.FunctionCall.method_names : [],
    knownApp: isFunctionCall ? KNOWN_APPS[key.access_key.permission.FunctionCall.receiver_id] : null,
    issues,
    warnings,
    recommendations,
    nonce: key.access_key.nonce
  };
}

// Calculate health score
export function calculateHealthScore(analysis) {
  let score = 100;
  let grade = 'A';
  
  const { keys, totalIssues, highSeverity, mediumSeverity, lowSeverity } = analysis;
  
  // Deduct points for issues
  score -= highSeverity * 25;
  score -= mediumSeverity * 10;
  score -= lowSeverity * 5;
  
  // Bonus for having function-call keys
  const hasFunctionCallKeys = keys.some(k => k.isFunctionCall);
  if (hasFunctionCallKeys && keys.length > 1) {
    score += 5;
  }
  
  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Assign grade
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  return { score, grade };
}

// Analyze account security
export async function analyzeAccountSecurity(accountId) {
  try {
    const rawKeys = await fetchAccessKeys(accountId);
    
    // Analyze each key
    const keys = rawKeys.map((key, index) => analyzeKeyRisk(key, index));
    
    // Aggregate statistics
    const fullAccessKeys = keys.filter(k => k.isFullAccess);
    const functionCallKeys = keys.filter(k => k.isFunctionCall);
    
    const allIssues = keys.flatMap(k => k.issues);
    const allWarnings = keys.flatMap(k => k.warnings);
    const allRecommendations = keys.flatMap(k => k.recommendations);
    
    const highSeverity = [...allIssues, ...allWarnings].filter(i => i.severity === 'high').length;
    const mediumSeverity = [...allIssues, ...allWarnings].filter(i => i.severity === 'medium').length;
    const lowSeverity = [...allIssues, ...allWarnings].filter(i => i.severity === 'low').length;
    const totalIssues = highSeverity + mediumSeverity + lowSeverity;
    
    // Group function-call keys by contract
    const keysByContract = {};
    functionCallKeys.forEach(key => {
      const contract = key.receiverId;
      if (!keysByContract[contract]) {
        keysByContract[contract] = [];
      }
      keysByContract[contract].push(key);
    });
    
    // Check for multiple keys to same contract
    const duplicateContractKeys = Object.entries(keysByContract)
      .filter(([_, keys]) => keys.length > 1)
      .map(([contract, keys]) => ({
        severity: 'low',
        type: 'DUPLICATE_CONTRACT_KEYS',
        message: `${keys.length} keys for ${contract}`,
        description: `You have multiple access keys for the same contract.`,
        action: 'Review if all keys are needed',
        contract,
        count: keys.length
      }));
    
    const analysis = {
      accountId,
      keys,
      totalKeys: keys.length,
      fullAccessKeys: fullAccessKeys.length,
      functionCallKeys: functionCallKeys.length,
      keysByContract,
      duplicateContractKeys,
      allIssues: [...allIssues, ...duplicateContractKeys],
      allWarnings,
      allRecommendations,
      highSeverity,
      mediumSeverity,
      lowSeverity,
      totalIssues: totalIssues + duplicateContractKeys.length,
      timestamp: new Date().toISOString()
    };
    
    // Calculate health score
    const health = calculateHealthScore(analysis);
    
    return {
      ...analysis,
      healthScore: health.score,
      healthGrade: health.grade
    };
  } catch (error) {
    console.error('Security analysis error:', error);
    throw error;
  }
}

// Get recommendations for improving security
export function getSecurityRecommendations(analysis) {
  const recommendations = [];
  
  if (analysis.fullAccessKeys > 1) {
    recommendations.push({
      priority: 'high',
      title: 'Multiple Full-Access Keys',
      description: `You have ${analysis.fullAccessKeys} full-access keys. Each key can control your entire account.`,
      action: 'Review each key and remove any you don\'t recognize or no longer use.',
      link: 'https://wallet.near.org',
      linkText: 'Manage Keys'
    });
  }
  
  if (analysis.duplicateContractKeys.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Duplicate Contract Keys',
      description: `You have multiple keys for the same contracts.`,
      action: 'Clean up duplicate keys to reduce your attack surface.',
      link: 'https://wallet.near.org',
      linkText: 'View Keys'
    });
  }
  
  const unknownContracts = analysis.keys.filter(k => 
    k.isFunctionCall && !k.knownApp
  );
  
  if (unknownContracts.length > 0) {
    recommendations.push({
      priority: 'medium',
      title: 'Unverified Contracts',
      description: `${unknownContracts.length} keys are for contracts not in our verified list.`,
      action: 'Verify these contracts are legitimate before using them.',
      link: 'https://nearblocks.io',
      linkText: 'Check Contracts'
    });
  }
  
  // Add best practices
  recommendations.push({
    priority: 'info',
    title: 'Security Best Practices',
    description: 'Regularly review your access keys and revoke any you no longer use.',
    action: 'Set a reminder to audit your keys monthly.',
    link: 'https://docs.near.org/concepts/basics/accounts/access-keys',
    linkText: 'Learn More'
  });
  
  return recommendations;
}

// Format key for display
export function formatPublicKey(publicKey) {
  if (!publicKey) return '';
  const parts = publicKey.split(':');
  if (parts.length === 2) {
    const key = parts[1];
    return `${key.substring(0, 8)}...${key.substring(key.length - 8)}`;
  }
  return publicKey;
}

// Get revoke instructions
export function getRevokeInstructions(keyType) {
  if (keyType === 'full-access') {
    return {
      warning: '⚠️ Be careful! Revoking a full-access key means you won\'t be able to use that method to access your account.',
      steps: [
        'Go to your NEAR wallet',
        'Navigate to Security settings',
        'Find the key you want to remove',
        'Click "Remove Key" and confirm',
        'Make sure you have another way to access your account first!'
      ],
      link: 'https://wallet.near.org',
      linkText: 'Open NEAR Wallet'
    };
  } else {
    return {
      warning: 'Revoking this key will disconnect the associated app from your account.',
      steps: [
        'Go to your NEAR wallet',
        'Navigate to Authorized Apps',
        'Find the app you want to disconnect',
        'Click "Disconnect" and confirm'
      ],
      link: 'https://wallet.near.org',
      linkText: 'Manage Apps'
    };
  }
}

