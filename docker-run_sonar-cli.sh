#!/bin/bash

docker container run --rm --network=host -e SONAR_HOST_URL="http://localhost:9000" -v "./src:/usr/src" sonarsource/sonar-scanner-cli -Dsonar.projectKey=conversao \
-Dsonar.sources=. \
-Dsonar.host.url=http://localhost:9000 \
-Dsonar.login=sqp_e1bfb37333ccceb52bed70b24ca0a1919ee1f766