// Autor: Álvaro Zermeño
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { InputForm } from "../components";
import { useUserStore } from "../stores/useUserStore";

export const SignupPage = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading} = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
            Crea tu cuenta
          </h2>
        </motion.div>

        <motion.div
          className="sm:mx-auto sm:w-full sm:max-w-md  mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputForm
                field="name"
                Icon={User}
                labelText="Nombre Completo"
                placeholder="Álvaro Zermeño"
                type="text"
                formData={formData}
                setFormData={setFormData}
              />
              <InputForm
                field="email"
                Icon={Mail}
                labelText="Direccion Email"
                placeholder="tuemail@ejemplo.com"
                type="email"
                formData={formData}
                setFormData={setFormData}
              />
              <InputForm
                field="password"
                Icon={Lock}
                labelText="Contraseña"
                placeholder="● ● ● ● ● ● ● ●"
                type="password"
                formData={formData}
                setFormData={setFormData}
              />
              <InputForm
                field="confirmPassword"
                Icon={Lock}
                labelText="Confirma tu Contraseña"
                placeholder="● ● ● ● ● ● ● ●"
                type="password"
                formData={formData}
                setFormData={setFormData}
              />

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium
                 text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 
                 transition duration-150 ease-in-out disabled:opacity-50 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Loading...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                    Sign Up
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text- center text-sm text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link to='/login' className="font-medium text-emerald-400 hover:text-emerald-300">
                Inicia Sesión Aquí <ArrowRight className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};
