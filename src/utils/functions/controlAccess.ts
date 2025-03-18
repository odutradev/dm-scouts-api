import dotenv from "dotenv";
dotenv.config();

import * as readline from 'readline';
import jwt from "jsonwebtoken";
import logger from "./logger";

const rl = readline.createInterface({
  output: process.stdout,
  input: process.stdin,
});

const ask = (question: string): Promise<string> => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const getClientData = async () => {
  const clientId = await ask('Insira o client-id: ');
  const validityDays = await ask('Tempo de validade (em dias): ');
  rl.close();

  return { clientId, validityDays: Number(validityDays) };
};

logger.info("Sistema de controle de acesso");

getClientData().then((questions) => {
    const data = {
        publicToken: process.env.PUBLIC_ACCESS_TOKEN || "",
        createAt: Date.now(),
        ...questions
    };

    const token = jwt.sign(data, process.env.PRIVATE_ACCESS_TOKEN || "",  { expiresIn: `${questions.validityDays}d` });
    logger.success("Token criado com sucesso");
    console.log(`token: "${token}"`);
});
