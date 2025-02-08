// Importa as funções necessárias dos SDKs do Firebase
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";
// TODO: Adicione os SDKs para os produtos Firebase que você deseja usar
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuração do Firebase para o seu aplicativo web
const firebaseConfig = {
  apiKey: "AIzaSyC2HLHn0ZPdJUuuteuvcWcRExiLqCJSRHg", // Chave da API do Firebase
  authDomain: "fire-homes-course-8a316.firebaseapp.com", // Domínio de autenticação do Firebase
  projectId: "fire-homes-course-8a316", // ID do projeto Firebase
  storageBucket: "fire-homes-course-8a316.firebasestorage.app", // Bucket de armazenamento do Firebase
  messagingSenderId: "772099479472", // ID do remetente de mensagens do Firebase
  appId: "1:772099479472:web:f83778cebdffa2b226a875" // ID do aplicativo Firebase
};

// Inicializa o Firebase
const currentApps = getApps(); // Obtém a lista de aplicativos Firebase já inicializados
let auth: Auth; // Declara uma variável para a autenticação
let storage: FirebaseStorage; // Declara uma variável para o armazenamento

// Se não houver aplicativos Firebase inicializados
if (!currentApps.length) {
  const app = initializeApp(firebaseConfig); // Inicializa um novo aplicativo Firebase com a configuração fornecida
  auth = getAuth(app); // Obtém a instância de autenticação do aplicativo inicializado
  storage = getStorage(app); // Obtém a instância de armazenamento do aplicativo inicializado
} else {
  // Se já houver um aplicativo Firebase inicializado
  const app = currentApps[0]; // Usa o primeiro aplicativo inicializado
  auth = getAuth(app); // Obtém a instância de autenticação do aplicativo existente
  storage = getStorage(app); // Obtém a instância de armazenamento do aplicativo existente
}

// Exporta as instâncias de autenticação e armazenamento para uso em outras partes do aplicativo
export { auth, storage };