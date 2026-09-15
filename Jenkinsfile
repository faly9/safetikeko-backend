pipeline {

    agent {
        label 'node-agent'
    }

    triggers {
        gitlab(
            triggerOnPush: true,
            triggerOnMergeRequest: false,
            branchFilterType: 'NameBasedFilter',
            includeBranchesSpec: 'main'
        )
    }

    stages {

        // ================================
        // 1. RÉCUPÉRER LE CODE BACKEND
        // ================================

        stage('Checkout') {
            steps {

                dir('backend') {
                    git branch: 'main',
                        url: 'https://gitlab.com/faly9/safetikeko-backend.git'
                }
            }
        }


        // ================================
        // 2. BACKEND CI
        // ================================

        stage('Backend CI') {
            steps {

                dir('backend') {

                    echo '===== INSTALL BACKEND DEPENDENCIES ====='

                    sh 'npm ci'


                    echo '===== PRISMA GENERATE ====='

                    sh 'npx prisma generate'


                    echo '===== BACKEND TESTS ====='

                    sh 'npm test -- --runInBand'


                    echo '===== BACKEND BUILD ====='

                    sh 'npm run build'
                }
            }
        }


        // ================================
        // 3. TRANSFERT VERS LE SERVEUR
        // ================================

        stage('Transfer') {
            steps {

                sshagent(['server-ssh']) {

                    sh '''
                        echo "===== PREPARATION SERVEUR ====="

                        ssh -o StrictHostKeyChecking=no \
                            faly@10.0.10.9 \
                            "mkdir -p /home/faly/safetikeko"


                        echo "===== TRANSFERT BACKEND ====="

                        rsync -az \
                            -e "ssh -o StrictHostKeyChecking=no" \
                            backend/ \
                            faly@10.0.10.9:/home/faly/safetikeko/
                    '''
                }
            }
        }


        // ================================
        // 4. DÉPLOIEMENT DOCKER
        // ================================

        stage('Deploy') {
            steps {

                sshagent(['server-ssh']) {

                    sh '''
                        echo "===== BUILD DOCKER BACKEND ====="

                        ssh -o StrictHostKeyChecking=no \
                            faly@10.0.10.9 "
                                cd /home/faly/safetikeko &&
                                docker compose build backend
                            "


                        echo "===== MIGRATION PRISMA ====="

                        ssh -o StrictHostKeyChecking=no \
                            faly@10.0.10.9 "
                                cd /home/faly/safetikeko &&
                                docker compose run --rm backend \
                                npx prisma migrate deploy
                            "


                        echo "===== DEMARRAGE BACKEND ====="

                        ssh -o StrictHostKeyChecking=no \
                            faly@10.0.10.9 "
                                cd /home/faly/safetikeko &&
                                docker compose up -d backend
                            "
                    '''
                }
            }
        }


        // ================================
        // 5. VÉRIFICATION BACKEND
        // ================================

        stage('Health Check') {
            steps {

                sshagent(['server-ssh']) {

                    sh '''
                        echo "===== VERIFICATION BACKEND ====="

                        sleep 10


                        echo "===== CONTAINER BACKEND ====="

                        ssh -o StrictHostKeyChecking=no \
                            faly@10.0.10.9 \
                            "cd /home/faly/safetikeko && docker compose ps backend"


                        echo "===== API BACKEND ====="

                        curl -f http://10.0.10.9:5000/api
                    '''
                }
            }
        }
    }


    // ================================
    // RÉSULTAT
    // ================================

    post {

        success {
            echo '======================================'
            echo 'BACKEND CI/CD SUCCESS'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'BACKEND CI/CD FAILED'
            echo '======================================'
        }
    }
}
