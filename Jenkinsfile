pipeline {
    agent any

    environment {
        IMAGE_NAME = "book-api"
        SNYK_TOKEN = credentials('snyk-token') // Jenkins credentials ID for your Snyk token
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

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker run -d -p 3001:3000 %IMAGE_NAME%'
            }
        }

        stage('Release') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                    bat 'docker tag %IMAGE_NAME% %DOCKER_USER%/%IMAGE_NAME%:latest'
                    bat 'docker push %DOCKER_USER%/%IMAGE_NAME%:latest'
                }
            }
        }

        stage('Monitoring & Alerting') {
            steps {
                bat '''
                curl -s http://localhost:3001/books || (
                  echo "❌ Application is down!" > monitoring-alert.txt
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
