import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/api/axios";
import { toast } from "sonner"

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log("send")
      const response = await axiosInstance.post("/auth/register", formData);
      console.log(response);
      // Redirect to login or dashboard on success
      navigate("/login");
      toast("Singup successfull")
    } catch (err: any) {
      toast("Signup failed")
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-6xl font-extrabold text-center tracking-tight m-12">
        Chat Agent
      </h1>
      <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

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
              placeholder="At least 6 characters"
              minLength={6}
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary underline hover:text-primary/80 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
