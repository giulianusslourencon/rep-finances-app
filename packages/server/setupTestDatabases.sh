sudo docker rm testMongo
sudo docker run -d -p 27017:27017 --name=testMongo mongo
