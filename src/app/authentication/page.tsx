"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./_components/sign-in-form";
import SignUpForm from "./_components/sign-up-form";

const AuthenticationPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>

          <TabsTrigger value="register">Criar conta</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <SignInForm />
        </TabsContent>

        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;
