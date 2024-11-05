// app/api/pincode/route.js
const availablePincodes = {
  245455: { location: "Ahmedabad", state: "Gujarat" },
  569878: { location: "Pawai", state: "Mumbai" },
  541876: { location: "Dehli", state: "Delhi" },
  215634: { location: "Bangalore", state: "Karnataka" },
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pincode = searchParams.get("pincode");

  if (pincode) {
    const pincodeInfo = availablePincodes[pincode];

    if (pincodeInfo) {
      return new Response(JSON.stringify({ available: true, ...pincodeInfo }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify({ available: false }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  return new Response(JSON.stringify({ error: "Pincode not provided" }), {
    status: 400,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
