pipeline {

    agent any

    environment {
        FRONTEND_IMAGE = "harshalsl0209/donato-frontend"
        BACKEND_IMAGE = "harshalsl0209/donato-backend"
    }

    stages {

        stage('Clone Repository') {
            steps {
            git branch: 'main',
            url: 'https://github.com/Supriya-gouda/Donato.git'
    }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    bat 'docker build -t %FRONTEND_IMAGE% .'
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('backend') {
                    bat 'docker build -t %BACKEND_IMAGE% .'
                }
            }
        }

        stage('Push Images to Docker Hub') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'

                    bat 'docker push %FRONTEND_IMAGE%'
                    bat 'docker push %BACKEND_IMAGE%'
                }
            }
        }

        stage('Deploy Containers') {

            steps {

                bat 'docker compose down'
                bat 'docker compose up -d --build'
            }
        }
    }
}