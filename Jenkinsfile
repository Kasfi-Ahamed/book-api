pipeline {
    agent any

    environment {
        IMAGE_NAME = "book-api"
        IMAGE_TAG = "v1.0.0"
        SNYK_TOKEN = credentials('snyk-token')
    }

    stages {
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Security Scan - Snyk') {
            steps {
                bat 'snyk auth %SNYK_TOKEN%'
                bat 'snyk monitor --all-projects --org=3267235c-867e-4eda-ad76-48b028a8cd64'
            }
        }

        stage('Code Quality - SonarQube') {
            steps {
                withSonarQubeEnv('LocalSonar') {
                    bat 'sonar-scanner'
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
                bat 'docker tag %IMAGE_NAME% %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker run -d -p 3001:3000 --name running_app %IMAGE_NAME%:%IMAGE_TAG%'
                sleep time: 8, unit: 'SECONDS' // ensure app is ready
            }
        }

        stage('Release') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'docker tag %IMAGE_NAME% %DOCKER_USER%/%IMAGE_NAME%:latest'
                    bat 'docker tag %IMAGE_NAME% %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%'
                    bat 'docker push %DOCKER_USER%/%IMAGE_NAME%:latest'
                    bat 'docker push %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%'
                }
            }
        }

        stage('Monitoring & Alerting') {
            steps {
                bat '''
                curl -s http://localhost:3001/health > healthcheck.log || (
                  echo "❌ Application is down!" > monitoring-alert.txt
                  type monitoring-alert.txt
                )

                curl -s http://localhost:3001/metrics > metrics.txt || (
                  echo "⚠️ Failed to fetch metrics!" >> monitoring-alert.txt
                )

                echo 🔍 Health Check Result:
                type healthcheck.log

                echo 🔍 Metrics Output:
                type metrics.txt

                if exist monitoring-alert.txt (
                  echo 🚨 Alerts:
                  type monitoring-alert.txt
                )
                '''
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finished successfully or with errors.'
        }
    }
}
