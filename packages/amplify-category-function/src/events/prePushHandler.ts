import { $TSContext, stateManager } from 'amplify-cli-core';
import {
  FunctionSecretsStateManager,
  storeSecretsPendingRemoval,
} from '../provider-utils/awscloudformation/secrets/functionSecretsStateManager';
import { categoryName } from '../provider-utils/awscloudformation/utils/constants';

export const prePushHandler = async (context: $TSContext) => {
  await ensureFunctionSecrets(context);
};

const ensureFunctionSecrets = async (context: $TSContext) => {
  const amplifyMeta = stateManager.getMeta();
  const functionNames = Object.keys(amplifyMeta?.[categoryName]);
  const funcSecretsManager = await FunctionSecretsStateManager.getInstance(context);
  for (const funcName of functionNames) {
    await funcSecretsManager.ensureNewLocalSecretsSyncedToCloud(funcName);
  }

  await storeSecretsPendingRemoval(context, functionNames);
};
