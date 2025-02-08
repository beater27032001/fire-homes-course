// Importa o módulo admin do Firebase
import admin from "firebase-admin";
// Importa as funções necessárias dos SDKs do Firebase Admin
import { getApps, ServiceAccount } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";

// Define a configuração da conta de serviço do Firebase
const serviceAccount = {
  "type": "service_account", // Tipo de conta
  "project_id": "fire-homes-course-8a316", // ID do projeto Firebase
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID, // ID da chave privada (obtida das variáveis de ambiente)
  "private_key": process.env.FIREBASE_PRIVATE_KEY, // Chave privada (obtida das variáveis de ambiente)
  "client_email": process.env.FIREBASE_CLIENT_EMAIL, // Email do cliente (obtido das variáveis de ambiente)
  "client_id": process.env.FIREBASE_CLIENT_ID, // ID do cliente (obtido das variáveis de ambiente)
  "auth_uri": "https://accounts.google.com/o/oauth2/auth", // URI de autenticação
  "token_uri": "https://oauth2.googleapis.com/token", // URI de token
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", // URL do certificado do provedor de autenticação
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40fire-homes-course-8a316.iam.gserviceaccount.com", // URL do certificado do cliente
  "universe_domain": "googleapis.com" // Domínio do universo
}

// Declara variáveis para Firestore e Auth
let firestore: Firestore;
let auth: Auth;
// Obtém a lista de aplicativos Firebase já inicializados
const currentApps = getApps();

// Se não houver aplicativos Firebase inicializados
if (!currentApps.length) {
  // Inicializa um novo aplicativo Firebase com a configuração da conta de serviço
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
  // Obtém a instância de autenticação do aplicativo inicializado
  auth = getAuth(app);
  // Obtém a instância do Firestore do aplicativo inicializado
  firestore = getFirestore(app);
} else {
  // Se já houver um aplicativo Firebase inicializado
  const app = currentApps[0]; // Usa o primeiro aplicativo inicializado
  // Obtém a instância do Firestore do aplicativo existente
  firestore = getFirestore(app);
  // Obtém a instância de autenticação do aplicativo existente
  auth = getAuth(app);
}

// Exporta as instâncias de Firestore e Auth para uso em outras partes do aplicativo
export { firestore, auth };