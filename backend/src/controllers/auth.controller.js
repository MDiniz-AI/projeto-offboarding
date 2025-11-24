import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// POST /login
export const gerarLinkTemporario =  (req, res) => {
    const { email, nome } = req.body;

     const token = jwt.sign(
    { email, nome },
    process.env.JWT_SECRET,
    { expiresIn: "60m" }
  );

   const link = `${process.env.FRONT_URL}/acessar?t=${token}`;
   return res.json({link});
};


