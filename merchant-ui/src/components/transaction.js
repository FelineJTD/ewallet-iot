function Transaction({ transaction }) {
  return (
    <div className="w-full text-zinc-50 grid grid-cols-[8rem_1fr_1fr] items-center py-6 border-b border-zinc-600">
      <p>{ transaction.type === "Top-up" ? "ᓚ₍ ^. .^₎" : transaction.status === "success" ? "ฅ^ •ﻌ• ^ฅ" : "/ᐠ - ˕ -マ" }</p>
      <div>
        <h3 className={`${transaction.status !== "success" && "line-through text-zinc-400"} text-xl`}>{ transaction.user }</h3>
        <p className={`${transaction.status !== "success" && "line-through text-zinc-400"}`}>{ transaction.status === "success" ? `${transaction.type} berhasil` : `${transaction.type} gagal`}</p>
      </div>
      <p className={`${transaction.status !== "success" && "line-through text-zinc-400"} text-right text-2xl`}>{ transaction.nominal }</p>
    </div>
  );
}

export default Transaction;
