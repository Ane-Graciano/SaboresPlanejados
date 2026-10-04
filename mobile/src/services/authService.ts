import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  initializeAuth,
  getReactNativePersistence,
  signOut,
} from 'firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { app } from './firebaseConfig';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// GoogleSignin.configure({
//   webClientId:
//     '328051519021-c5ttpf976qbo3q4tn4nue609a2g9dod0.apps.googleusercontent.com',
// });

export const cadastrarUsuario = async (
  nome: string,
  email: string,
  senha: string,
) => {
  try {
    const resultado = await createUserWithEmailAndPassword(
      auth,
      email,
      senha,
    );

    await updateProfile(resultado.user, {
      displayName: nome,
    });

    return resultado.user;
  } catch (error) {
    throw error;
  }
};

export const entrarComEmailESenha = async (
  email: string,
  senha: string,
) => {
  const resultado = await signInWithEmailAndPassword(
    auth,
    email,
    senha,
  );

  return resultado.user;
};

export const recuperarSenha = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// export const entrarComGoogle = async () => {
//   await GoogleSignin.hasPlayServices({
//     showPlayServicesUpdateDialog: true,
//   });

//   const resultado = await GoogleSignin.signIn();

//   if (!resultado.data?.idToken) {
//     throw new Error('Não foi possível obter o token do Google.');
//   }

//   const credential = GoogleAuthProvider.credential(
//     resultado.data.idToken,
//   );

//   const usuario = await signInWithCredential(
//     auth,
//     credential,
//   );

//   return usuario.user;
// };

export const sair = async () => {
  await signOut(auth);
};