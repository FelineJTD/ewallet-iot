function Transaction({ transaction }) {
  return (
    <div className="w-full text-zinc-50 grid grid-cols-[8rem_1fr_1fr] items-center py-6 border-b border-zinc-600">
      <p>{ transaction.msg[1] === "success" ? "ฅ^ •ﻌ• ^ฅ" : "/ᐠ - ˕ -マ" }</p>
      <div>
        <h3 className={`${transaction.msg[1] !== "success" && "line-through text-zinc-400"} text-xl`}>{ transaction.user }</h3>
        <p className={`${transaction.msg[1] !== "success" && "line-through text-zinc-400"}`}>{ transaction.msg[1] === "success" ? "Pembayaran berhasil" : "Pembayaran gagal"}</p>
      </div>
      <p className={`${transaction.msg[1] !== "success" && "line-through text-zinc-400"} text-right text-2xl`}>{ transaction.msg[2] }</p>
    </div>
  );
}

export default Transaction;
