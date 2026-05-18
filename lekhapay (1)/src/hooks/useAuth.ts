import { useState, useEffect } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser 
} from "firebase/auth";
import { auth } from "../firebase";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: e };
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: e };
    }
  };

  return { user, isAuthLoading, handleLogin, handleLogout };
}
