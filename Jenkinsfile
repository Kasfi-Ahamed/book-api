pipeline {
    agent any

    environment {
        IMAGE_NAME = "book-api"
        SNYK_TOKEN = credentials('snyk-token') // Jenkins credentials ID for Snyk API Token
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
                // Authenticate and monitor project with Snyk
                bat 'echo %SNYK_TOKEN% > snyk.token'
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

        stage('Run Docker Container') {
            steps {
                bat 'docker run -d -p 3002:3000 %IMAGE_NAME%'
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finished successfully or with errors.'
        }
    }
}
