function Transaction({ transaction }) {
  console.log(transaction);
  return (
    <div className="w-full text-zinc-50">
      <p>{transaction}</p>
    </div>
  );
}

export default Transaction;
