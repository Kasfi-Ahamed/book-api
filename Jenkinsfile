pipeline {
    agent any

    environment {
        IMAGE_NAME = "book-api"
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

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Run Docker Container') {
            steps {
                bat 'docker run -d -p 3000:3000 %IMAGE_NAME%'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
