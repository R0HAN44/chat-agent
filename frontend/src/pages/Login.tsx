import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response : any = await axiosInstance.post("/auth/login", formData);
      console.log(response)
      if(response.success){
        toast.success("Login successful!");
        localStorage.setItem("chat-agent-token", response.data.token)
        navigate("/agents");
      }
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(()=>{
    if(localStorage.getItem("chat-agent-token")){
      navigate("/agents")
    }
  },[navigate])
  return (
    <>
      <h1 className="text-6xl font-extrabold text-center tracking-tight m-12">
        Chat Agent
      </h1>

      <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">

        <h2 className="mb-6 text-2xl font-semibold text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary underline hover:text-primary/80 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
