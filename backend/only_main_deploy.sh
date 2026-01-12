#!/bin/bash
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  # Proceed with the build for the main branch
  exit 1;
else
  # Don't build for any other branch
  exit 0;
fi
