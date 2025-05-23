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
                bat 'snyk monitor --all-projects --org=3267235c-867e-4eda-ad76-48b828a8cd64'
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
                bat 'docker run -d -p 3001:3000 %IMAGE_NAME%'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
