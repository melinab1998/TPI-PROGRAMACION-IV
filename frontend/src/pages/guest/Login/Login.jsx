import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { loginValidations } from "@/utils/validations";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    login();
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-center text-2xl font-bold">
                Iniciar sesión
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants}>
                <Label htmlFor="email" className="mb-2">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese el email..."
                  className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                  {...register("email", loginValidations.email)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>}
              </motion.div>

              <motion.div variants={itemVariants}>
                <Label htmlFor="password" className="mb-2">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese la contraseña..."
                  className="border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/50"
                  {...register("password", loginValidations.password)}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex justify-between items-center py-2"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="text-sm">
                    Recordar contraseña
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  as={motion.button}
                >
                  Ingresar
                </Button>
              </motion.div>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center text-sm mt-5 pt-4 border-t"
            >
              ¿No tienes cuenta?{" "}
              <Link to="/register">
                <Button variant="link" className="p-0 font-medium">
                  Regístrate
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}