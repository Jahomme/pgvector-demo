import { db } from "./index";
import { documents } from "./schema";
import { GoogleGenAI } from "@google/genai";
import { sql } from "drizzle-orm";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Erro: GEMINI_API_KEY não configurada no arquivo .env");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey });

const mockItems = [
  {
    title: "Smartphone Samsung Galaxy S24 Ultra",
    content: "Celular topo de linha da Samsung com tela AMOLED, câmera de 200 megapixels e recursos avançados de Inteligência Artificial para edição de fotos e tradução simultânea.",
  },
  {
    title: "Câmera Profissional DSLR Canon EOS",
    content: "Equipamento fotográfico profissional com sensor CMOS, lentes intercambiáveis e autofoco de alta velocidade, ideal para registrar momentos e ensaios de alta qualidade.",
  },
  {
    title: "Notebook Gamer Dell G15",
    content: "Computador portátil voltado para jogos eletrônicos equipado com placa de vídeo Nvidia RTX 4060, processador de alta performance i7 e tela com taxa de atualização de 144Hz.",
  },
  {
    title: "Cafeteira Nespresso Vertuo",
    content: "Máquina de café expresso que utiliza cápsulas, dotada de sistema de infusão e alta pressão para extrair bebidas cremosas de maneira rápida e prática.",
  },
  {
    title: "Fone de Ouvido Bluetooth Sony WH-1000XM5",
    content: "Dispositivo de áudio wireless do tipo over-ear com cancelamento de ruído ativo premium, bateria para 30 horas de reprodução e som de alta fidelidade.",
  },
  {
    title: "Smart TV LG OLED 65\"",
    content: "Televisor inteligente com tela OLED de pixels autoiluminados, resolução 4K real, pretos perfeitos e comandos de voz integrados.",
  },
  {
    title: "Livro O Senhor dos Anéis (Volume Único)",
    content: "Obra clássica de fantasia de J.R.R. Tolkien contendo a jornada de Frodo para destruir o Anel em edição especial de capa dura com mapas e ilustrações.",
  },
  {
    title: "Smartwatch Apple Watch Series 9",
    content: "Relógio inteligente com tela sempre ativa, sensores de oxigênio no sangue, eletrocardiograma e detecção de acidentes com conexão celular integrada.",
  },
];

async function seed() {
  console.log("Garantindo extensões e configurações de busca...");
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS unaccent;`);
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = 'portuguese_unaccent') THEN
        CREATE TEXT SEARCH CONFIGURATION portuguese_unaccent (COPY = portuguese);
        ALTER TEXT SEARCH CONFIGURATION portuguese_unaccent ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem;
      END IF;
    END
    $$;
  `);

  console.log("Limpando banco de dados...");
  await db.execute(sql`TRUNCATE TABLE ${documents} RESTART IDENTITY CASCADE`);

  console.log(`Iniciando população de dados (${mockItems.length} itens)...`);

  for (const item of mockItems) {
    try {
      console.log(`Gerando embedding para: "${item.title}"...`);
      
      const result = await genAI.models.embedContent({
        model: "gemini-embedding-2",
        contents: item.content,
        config: { outputDimensionality: 768 },
      });

      const embedding = result.embeddings[0].values;

      await db.insert(documents).values({
        title: item.title,
        content: item.content,
        embedding: embedding,
        searchVector: sql`setweight(to_tsvector('portuguese_unaccent', ${item.title}), 'A') || setweight(to_tsvector('portuguese_unaccent', ${item.content}), 'B')`,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(`Erro ao inserir item ${item.title}:`, err);
    }
  }

  console.log("Banco de dados populado com sucesso!");
  process.exit(0);
}

seed();
