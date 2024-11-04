// app/api/pincode/route.js
const availablePincodes = [245455, 569878, 541876, 215634];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get("pincode");

  if (pincode) {
    const isAvailable = availablePincodes.includes(Number(pincode));
    return new Response(JSON.stringify({ available: isAvailable }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ error: "Pincode not provided" }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
