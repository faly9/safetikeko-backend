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

        stage('Checkout Backend') {
            steps {
                git branch: 'main',
                    url: 'https://gitlab.com/faly9/safetikeko-backend.git'
            }
        }

        stage('Test Webhook') {
            steps {
                sh '''
                    echo "================================="
                    echo "     SAFETIKEKO BACKEND TEST"
                    echo "================================="

                    echo "Job      : $JOB_NAME"
                    echo "Build    : $BUILD_NUMBER"
                    echo "Branch   : $GIT_BRANCH"
                    echo "Commit   : $GIT_COMMIT"
                    echo "Date     : $(date)"

                    echo ""
                    echo "Repository récupéré avec succès."

                    echo ""
                    echo "Fichiers du projet :"
                    ls -la
                '''
            }
        }
    }

    post {
        success {
            echo '================================='
            echo 'BACKEND WEBHOOK TEST : SUCCESS'
            echo '================================='
        }

        failure {
            echo '================================='
            echo 'BACKEND WEBHOOK TEST : FAILED'
            echo '================================='
        }
    }
}