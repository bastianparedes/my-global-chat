
export default (req, res) => {
  const message = req.body;
  res?.socket?.server?.io?.emit("message", message);
  res.status(201).json(message);
};
