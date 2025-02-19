"use client";

import React, { useState } from "react";
import { Card, Label, TextInput, Button, Tabs, Checkbox } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [id.replace('login-', '')]: value
    }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [id.replace('signup-', '')]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          senha: loginData.password
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      if (rememberMe) {
        localStorage.setItem("email", loginData.email);
      }

      await Swal.fire({
        icon: "success",
        title: "Login realizado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      await Swal.fire({
        icon: "error",
        title: "Erro no login",
        text: "Email ou senha incorretos",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      await Swal.fire({
        icon: "error",
        title: "Erro no cadastro",
        text: "As senhas não coincidem",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: signupData.name,
          email: signupData.email,
          senha: signupData.password
        }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Cadastro realizado com sucesso!",
        text: "Você já pode fazer login",
        showConfirmButton: false,
        timer: 1500,
      });

      // Reset form and switch to login tab
      setSignupData({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Signup error:", error);
      await Swal.fire({
        icon: "error",
        title: "Erro no cadastro",
        text: "Não foi possível realizar o cadastro",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <Card className="w-full max-w-md shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Compartilha Online
          </h2>
          <p className="text-gray-600">Entre ou crie sua conta</p>
        </div>

        <Tabs
          aria-label="Authentication tabs"
          style="underline"
          className="border-b border-gray-200"
          theme={{
            tablist: {
              styles: {
                underline: "gap-6 border-b border-gray-200",
              },
              tabitem: {
                base: "relative flex items-center justify-center rounded-none p-0 text-sm font-medium",
                styles: {
                  underline: {
                    base: "rounded-none p-4 text-sm",
                    active: {
                      on: "active rounded-none border-b-2 border-blue-600 text-blue-600",
                      off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600",
                    },
                  },
                },
              },
            },
          }}
        >
          <Tabs.Item active title="Login">
            <form className="mt-6 flex flex-col gap-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-gray-700">
                  E-mail
                </Label>
                <TextInput
                  id="login-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className="focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-gray-700">
                  Senha
                </Label>
                <TextInput
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="focus:border-blue-600 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="cursor-pointer text-sm text-gray-600"
                  >
                    Lembrar senha
                  </Label>
                </div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>

              <Button
                type="submit"
                className="mt-4 bg-blue-600 transition-colors duration-200 hover:bg-blue-700"
              >
                Entrar
              </Button>
            </form>
          </Tabs.Item>

          <Tabs.Item title="Cadastro">
            <form className="mt-6 flex flex-col gap-5" onSubmit={handleSignup}>
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-gray-700">
                  Nome
                </Label>
                <TextInput
                  id="signup-name"
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={signupData.name}
                  onChange={handleSignupChange}
                  className="focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-gray-700">
                  E-mail
                </Label>
                <TextInput
                  id="signup-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  required
                  value={signupData.email}
                  onChange={handleSignupChange}
                  className="focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-gray-700">
                  Senha
                </Label>
                <TextInput
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={signupData.password}
                  onChange={handleSignupChange}
                  className="focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirmPassword" className="text-gray-700">
                  Confirmar Senha
                </Label>
                <TextInput
                  id="signup-confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  className="focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <Button
                type="submit"
                className="mt-4 bg-blue-600 transition-colors duration-200 hover:bg-blue-700"
              >
                Cadastrar
              </Button>
            </form>
          </Tabs.Item>
        </Tabs>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link
            href="/"
            className="text-blue-600 transition-colors duration-200 hover:text-blue-700 hover:underline"
          >
            ← Voltar para a Landing Page
          </Link>
        </div>
      </Card>
    </main>
  );
}
