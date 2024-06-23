kubectl apply -f deployment-main.yaml -n biatec
kubectl delete configmap biatec-identity-main-conf -n biatec
kubectl create configmap biatec-identity-main-conf --from-file=conf -n biatec
kubectl rollout restart deployment/biatec-identity-main-deployment -n biatec
kubectl rollout status deployment/biatec-identity-main-deployment -n biatec
