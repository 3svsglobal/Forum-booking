// Vercel Serverless Function - 토스페이먼츠 결제 승인
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { paymentKey, orderId, amount } = req.body;

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ message: '필수 파라미터가 누락되었습니다.' });
  }

  // 시크릿 키 (테스트 키 - 심사 통과 후 실제 키로 교체)
  const secretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

  // Base64 인코딩 (시크릿키 + ":")
  const encryptedSecretKey = "Basic " + Buffer.from(secretKey + ":").toString("base64");

  try {
    const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: encryptedSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // 결제 승인 성공
      return res.status(200).json(data);
    } else {
      // 결제 승인 실패
      return res.status(response.status).json(data);
    }
  } catch (error) {
    return res.status(500).json({
      message: "결제 승인 중 서버 오류가 발생했습니다.",
      error: error.message,
    });
  }
}
