import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import Consul from "consul";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);  

  const port = 3005;
  const consul = new Consul({ host: 'localhost', port: 8500});

  
}