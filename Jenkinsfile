 pipeline {
    agent any 
    environment {
        DOCKERHUB_CREDENTIALS = credentials('docker')
    }
    stages {
        stage('Testing') { 
            steps {
                script {
                    last_started = env.STAGE_NAME
                }
                sh '''#!/bin/bash
                    echo "installing jest framework...";
                    if npm install --save-dev jest;then
                        echo "running jest testing...";
                        npm test;
                        
                    fi
                ''' 
            }
        }
        stage('Build and Push') { 
            steps {
                script {
                    last_started = env.STAGE_NAME
                }
                sh '''#!/bin/bash
                    echo "building docker image...";
                    if echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin;then
                        if docker build . -t muhanedyahya/pipline-v1-app:latest;then
                            echo "image successfully created.";
                            echo "pushing image to docker hub.....";
                                if docker push muhanedyahya/pipline-v1-app:latest;then
                                    echo "image pushed seccessfully.";
                                else
                                    echo "error in pushing image!!! something went wrong";
                                fi
                        else
                            sh 'echo cant build the image';
                        fi
                    else 
                        echo "cant login to docker hub!!!";
                    fi    
                '''  
            }
        }
        stage('Deploy on kubernetes') { 
            steps {
                script {
                    last_started = env.STAGE_NAME
                }
                withKubeConfig([credentialsId: 'kubernetes']) {
                    sh '''#!/bin/bash
                        echo "Running the app in kubernetes...";
                        if  kubectl apply -f kubernetes.yaml;then
                            echo "Node app deployed seccessfully on kubernetes.";
                            echo "you can view the app by running a service using minikube..";
                            echo "minikube service app-service";
                        else
                            echo "Error in deploying on kubernetes";
                        fi
                    '''
                }
            }
        }
        stage('Monitor') { 
            steps {
                script {
                    last_started = env.STAGE_NAME
                }
                sh '''#!/bin/bash
                    container=prometheus;
                    running=$( docker container inspect -f '{{.State.Running}}' $container 2>/dev/null);

                    if [ $running -eq 1 ]; then
                        echo "There is no prometheus, we are preparing it now..";
                        echo "'$container' does not exist." 2> /dev/null ;
                    else 
                        echo "Prometheus is already running we will make a simple refresh";
                        docker stop $container;
                        docker container prune -f;
                    fi

                    echo "Running prometheus..."
                    if  docker run --name prometheus -p 9090:9090 -d -v $(pwd)/prometheus.yml:/opt/bitnami/prometheus/conf/prometheus.yml  bitnami/prometheus:latest;then
                        echo "prometheus deployed on http://localhost:9090";
                        echo "...................................";
                            container=grafana;
                            running=$( docker container inspect -f '{{.State.Running}}' $container 2>/dev/null);

                            if [ $running -eq 1 ]; then
                                echo "'$container' does not exist." 2> /dev/null ;
                                echo "There is no prometheus, we are preparing it now..";
                            else 
                                echo "Grafana is already running we will make a simple refresh";
                                docker stop $container;
                                docker container prune -f;
                            fi

                            echo "Running Grafana..."
                            if  docker run -d --name=grafana -p 3000:3000 grafana/grafana;then
                                echo "Grafana deployed on http://localhost:3000";
                                echo "...................................";
                                echo "Your can setup your your dashboard from the link";
                                echo "username:admin && password admin";
                                
                            else
                                echo "Error in deploying Grafana. check your monitor stage!";
                            fi
                    else
                        echo "Error in deploying prometheus also Grafana will not deployed. check your monitor stage!";
                    fi
                ''' 
            }
        }
    }

    post {  
         success {  
             mail(body: 'All stages of your project have been successfully prepared and deployed.', subject: 'Project successfully deployed!', to: 'yahya.muhaned@gmail.com')
         }  
         failure {  
            mail(body: "An error occurred during the ${currentBuild.currentStage} stage", subject: "${currentBuild.currentStage} stage Alert !!", to: 'yahya.muhaned@gmail.com') 
         }  

     }  
}