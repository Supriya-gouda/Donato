pipeline {

    agent any

    environment {

        FRONTEND_IMAGE = "harshalsl0209/donato-frontend"
        BACKEND_IMAGE  = "harshalsl0209/donato-backend"
    }

    stages {

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

        stage('Create Environment Files') {

            steps {

                withCredentials([

                    string(credentialsId: 'SUPABASE_URL', variable: 'SUPABASE_URL'),

                    string(credentialsId: 'SUPABASE_ANON_KEY', variable: 'SUPABASE_ANON_KEY')

                ]) {

                    writeFile file: 'frontend/.env', text: """
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
"""

                    writeFile file: 'backend/.env', text: """
PORT=8080
"""
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

    post {

        success {

            echo 'Pipeline executed successfully!'
        }

        failure {

            echo 'Pipeline failed!'
        }
    }
}