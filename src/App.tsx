import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { PostForm } from "./Components/PostForm/PostForm";
import { PostTable } from "./Components/PostTable/PostTable";
import styles from "./App.module.css";

const queryClient = new QueryClient();

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <div className={styles.appContainer}>
      <header>
        <h1>Список Постов</h1>
      </header>
      <main>
        <PostForm />
        <PostTable />
      </main>
    </div>
  </QueryClientProvider>
);
