// middleware/pollerAuth.js
export default function pollerAuth(req, res, next) {
  const secret = req.headers['x-poller-secret'];
  if (!secret || secret !== process.env.API_SECRET) {
    return res.status(401).json({ message: 'Unauthorized: Invalid poller secret' });
  }
  next();
}
