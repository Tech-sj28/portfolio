export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { name, email, message } = req.body;
  
      console.log("Received:", { name, email, message });
  
      // For now just test response
      return res.status(200).json({
        success: true,
        message: "API working!"
      });
  
    } catch (error) {
      return res.status(500).json({
        error: "Server error"
      });
    }
  }