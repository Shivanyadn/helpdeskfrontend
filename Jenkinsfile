pipeline {
    agent any

   

    stages {
        stage('Checkout') {
            steps {
                // Use the correct repository URL and credentials
                git branch: 'main', url: 'https://github.com/Shivanyadn/helpdeskfrontend.git', credentialsId: 'GithubPAT'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t helpdesk_frontend_image .'
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    // Stop and remove the existing container if it exists
                    sh 'docker stop helpdesk_frontend_container || true'
                    sh 'docker rm helpdesk_frontend_container || true'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Run the Docker container with volumes for photos and QR codes
                    sh '''
                    docker run -d --name helpdesk_frontend_container -p 3011:3000 \
                      --network bridge \
                      helpdesk_frontend_image
                    '''
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
    }
}