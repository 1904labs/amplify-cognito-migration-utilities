#!/bin/bash
# A simple script to delete all users from a cognito user pool. NOTE: jq must be installed

COGNITO_USER_POOL_ID=your-user-pool-id
REGION=your-region-1


aws cognito-idp list-users --region $REGION --user-pool-id $COGNITO_USER_POOL_ID | jq -r '.Users | .[] | .Username' | xargs -n 1 -P 5 -I % bash -c "echo Deleting %; aws cognito-idp admin-delete-user --region $REGION --user-pool-id $COGNITO_USER_POOL_ID --username %"