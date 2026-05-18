import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const clearAllUserData = async (userId: string) => {
  if (!userId) throw new Error("No user ID provided");

  // Collections to clear
  const collectionsToDelete = ["transactions", "budgets", "goals", "invoices", "subscriptions", "ledger", "achievements"];
  
  for (const colName of collectionsToDelete) {
    const querySnapshot = await getDocs(collection(db, "users", userId, colName));
    const deletePromises = querySnapshot.docs.map(document => 
      deleteDoc(doc(db, "users", userId, colName, document.id))
    );
    await Promise.all(deletePromises);
  }
  return true;
};