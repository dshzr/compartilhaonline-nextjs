import React from "react";
import { Button } from "flowbite-react";
import Link from "next/link"; // use Next.js Link component instead of react-router-dom

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-8 py-6">
          <div className="text-2xl font-extrabold text-black">
            Compartilha Online
          </div>
          <ul className="hidden space-x-8 md:flex">
            <li>
              <a href="#beneficios" className="text-black hover:text-blue-600">
                beneficios
              </a>
            </li>
            <li>
              <a href="#recursos" className="text-black hover:text-blue-600">
                recursos
              </a>
            </li>
            <li>
              <a href="#preco" className="text-black hover:text-blue-600">
                preço
              </a>
            </li>
            <li>
              <a href="#contato" className="text-black hover:text-blue-600">
                contato
              </a>
            </li>
          </ul>
          <div>
            {/* Wrap button in Link for navigation */}
            <Link href="/login">
              <Button color="primary" className="text-lg font-bold">
                Quero começar
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto grid max-w-screen-xl px-6 py-12 lg:grid-cols-12 lg:gap-12 lg:py-20 xl:gap-0">
          <div className="mr-auto place-self-center lg:col-span-7 space-y-6">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
              Cansado de tirar <br />FOTOS das apresentações?
            </h1>
            <p className="max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:text-xl">
              Você tem o direito a baixar todos os slides de uma apresentação no
              modelo gratuito, desde que, a pessoa compartilhe publicamente.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* Wrap hero buttons with Link */}
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              >
                Capturar
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-blue-300 px-6 py-3 text-base font-medium text-blue-900 hover:bg-blue-50 focus:ring-4 focus:ring-blue-100"
              >
                Compartilhar
              </Link>
            </div>
          </div>
          <div className="hidden lg:col-span-5 lg:mt-0 lg:flex">
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
              alt="Mockup"
            />
          </div>
        </div>
      </section>

      {/* Benefícios Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-6 py-12 sm:py-20 lg:px-6">
          <div className="mb-12 max-w-screen-md text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Experimente a facilidade na palma da sua mão
            </h2>
            <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
              Basta escanear o QR Code da apresentação para capturar, compartilhar e baixar todos os slides com um clique.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Digitalização Rápida */}
            <div className="text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L7 13.586 4.707 11.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l9-9a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold dark:text-white">Digitalização Rápida</h3>
              <p className="text-gray-500 dark:text-gray-400">Capture o QR Code e acesse os slides instantaneamente.</p>
            </div>
            {/* Card 2: Compartilhamento Fácil */}
            <div className="text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 8V6a1 1 0 10-2 0v4a1 1 0 001 1h3a1 1 0 100-2h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold dark:text-white">Compartilhe com um Clique</h3>
              <p className="text-gray-500 dark:text-gray-400">Envie os slides para colegas e amigos de forma simples.</p>
            </div>
            {/* Card 3: Download Instantâneo */}
            <div className="text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L2 7l8 5 8-5-8-5zm0 7L2 7v6l8 5 8-5V7l-8 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold dark:text-white">Download Instantâneo</h3>
              <p className="text-gray-500 dark:text-gray-400">Baixe apresentações completas sem complicações.</p>
            </div>
            {/* Card 4: Acesso Personalizado */}
            <div className="text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <svg className="h-6 w-6 text-red-600 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 012 0v7a1 1 0 01-2 0V2z" />
                  <path fillRule="evenodd" d="M5 8a3 3 0 016 0v2a3 3 0 01-6 0V8zm3 9a6 6 0 006-6H8a6 6 0 006 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold dark:text-white">Acesso Personalizado</h3>
              <p className="text-gray-500 dark:text-gray-400">Visualize apenas o que você precisa, sem distrações.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos Section */}
      <section className="bg-gray-100 dark:bg-gray-700">
        <div className="mx-auto max-w-screen-xl px-6 py-12 sm:py-20 lg:px-6">
          <div className="mb-12 max-w-screen-md text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Crie e Gerencie suas Apresentações com Controle Total
            </h2>
            <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
              Para você que cria apresentações: defina se serão públicas ou privadas e compartilhe apenas com quem desejar.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            {/* Card 1: Gerenciamento Intuitivo */}
            <div className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.83-4H8.83A3 3 0 106 8a3 3 0 002.17 2.83v2.34A3 3 0 108 16a3 3 0 002.83-2h2.34A3 3 0 1015 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold dark:text-white">Gerenciamento Intuitivo</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Crie, edite e organize seus slides de forma simples e rápida.
              </p>
            </div>
            {/* Card 2: Privacidade Personalizável */}
            <div className="flex flex-col items-center rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-4a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 112 0v4a1 1 0 11-2 0v-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold dark:text-white">Privacidade Personalizável</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Defina suas apresentações como públicas ou privadas e compartilhe somente com seu público escolhido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preços Section */}
      <section id="preco" className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-10">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold text-black mb-4">Preços</h2>
            <p className="text-gray-500 text-lg">
              Pacote pessoa física ou jurídica
            </p>
            <p className="text-gray-500 mt-2">
              Aqui o autor que faz o upload da sua apresentação e decide se vai ou não cobrar um valor do conteúdo.
            </p>
            <p className="text-gray-500 mt-2 font-semibold">
              ESSE VALOR NÃO PODE SER MAIOR DO QUE R$19,90.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Pessoa Física */}
            <div className="flex flex-col rounded-lg border p-8 space-y-6 hover:shadow-lg transition-shadow">
              <h3 className="text-center text-xl font-bold text-black">Pessoa Física</h3>
              <p className="text-center text-3xl font-extrabold text-black">
                R$29<span className="text-base font-medium text-gray-500">/por mês</span>
              </p>
              <ul className="space-y-4 flex-grow">
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Acesso aos conteúdos liberados pelos autores</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Compartilhe o que quiser</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Divulgue o seu trabalho</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download grátis</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Formato das imagens (JPG)</span>
                </li>
              </ul>
              <Link href="/login" className="w-full">
                <button className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                  Quero começar
                </button>
              </Link>
            </div>

            {/* Card 2: Usuário Final */}
            <div className="relative flex flex-col rounded-lg border p-8 space-y-6 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 rounded-bl-lg bg-blue-600 px-3 py-1 text-xs font-bold uppercase text-white">
                Gratuito
              </div>
              <h3 className="text-center text-xl font-bold text-black">Usuário Final</h3>
              <p className="text-center text-3xl font-extrabold text-black">
                R$0
              </p>
              <ul className="space-y-4 flex-grow">
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Capture o que tiver disponível</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Compartilhe o que quiser</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Divulgue o seu trabalho</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download grátis</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Formato das imagens (JPG)</span>
                </li>
              </ul>
              <Link href="/login" className="w-full">
                <button className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                  Quero começar
                </button>
              </Link>
            </div>

            {/* Card 3: Pessoa Jurídica */}
            <div className="flex flex-col rounded-lg border p-8 space-y-6 hover:shadow-lg transition-shadow">
              <h3 className="text-center text-xl font-bold text-black">Pessoa Jurídica</h3>
              <p className="text-center text-3xl font-extrabold text-black">
                R$149<span className="text-base font-medium text-gray-500">/por mês</span>
              </p>
              <ul className="space-y-4 flex-grow">
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Ambiente privado</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Compartilhe o que quiser</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Divulgue o seu trabalho</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download grátis</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Formato das imagens (JPG)</span>
                </li>
              </ul>
              <Link href="/login" className="w-full">
                <button className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                  Quero começar
                </button>
              </Link>
            </div>

            {/* Card 4: Donos de Congressos */}
            <div className="flex flex-col rounded-lg border p-8 space-y-6 hover:shadow-lg transition-shadow">
              <h3 className="text-center text-xl font-bold text-black">Donos de Congressos, Eventos e Feiras</h3>
              <p className="text-center text-3xl font-extrabold text-black">
                Sob medida<span className="text-base font-medium text-gray-500">/por mês</span>
              </p>
              <ul className="space-y-4 flex-grow">
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Ambiente privado</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Compartilhe o que quiser</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Divulgue o seu trabalho</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Download grátis</span>
                </li>
                <li className="flex items-center">
                  <svg className="mr-2 h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Formato das imagens (JPG)</span>
                </li>
              </ul>
              <Link href="/login" className="w-full">
                <button className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors">
                  Quero começar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200">
        <div className="mx-auto max-w-screen-xl px-6 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold">Compartilha Online</h3>
              <p className="text-gray-400">
                Plataforma inovadora para capturar e compartilhar apresentações.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Navegue</h3>
              <ul className="space-y-2">
                <li><a href="#beneficios" className="hover:text-blue-400">Benefícios</a></li>
                <li><a href="#recursos" className="hover:text-blue-400">Recursos</a></li>
                <li><a href="#preco" className="hover:text-blue-400">Preço</a></li>
                <li><a href="#contato" className="hover:text-blue-400">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400">Sobre nós</a></li>
                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400">Carreiras</a></li>
                <li><a href="#" className="hover:text-blue-400">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-bold">Contato</h3>
              <ul className="space-y-2">
                <li><p>Email: contato@compartilhaonline.com</p></li>
                <li><p>Telefone: (XX) XXXX-XXXX</p></li>
                <li><p>Endereço: Rua Exemplo, 123</p></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Compartilha Online. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
