<section className="mt-16">

  {/* ================= HEADER ================= */}
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-5xl font-bold">
      Buy Trading Account
    </h2>

    <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
      Choose your preferred account size and start your journey to becoming a funded trader.
    </p>
  </div>

  {/* ================= CHALLENGE ACCOUNTS ================= */}
  <div className="mb-16">

    <div className="flex items-center gap-3 mb-6">
      <div className="h-8 w-1 rounded-full bg-blue-500"></div>

      <div>
        <h3 className="text-2xl md:text-3xl font-bold">
          Challenge Accounts
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          Pass the evaluation and move to the next phase.
        </p>
      </div>
    </div>

    {challengePlans?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {challengePlans.map((plan, index) => (
          <PlanCard
            key={plan.id || index}
            plan={plan}
            formatMoney={formatMoney}
            buttonColor="blue"
            buttonText="Buy Challenge"
            onBuy={handleBuyPlan}
            buyingPlanId={buyingPlanId}
          />
        ))}

      </div>
    ) : (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No challenge plans available
      </div>
    )}

  </div>

  {/* ================= INSTANT ACCOUNTS ================= */}
  <div className="mb-10">

    <div className="flex items-center gap-3 mb-6">
      <div className="h-8 w-1 rounded-full bg-green-500"></div>

      <div>
        <h3 className="text-2xl md:text-3xl font-bold">
          Instant Funding Accounts
        </h3>

        <p className="text-gray-400 text-sm mt-1">
          Get faster access with instant funding options.
        </p>
      </div>
    </div>

    {instantPlans?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {instantPlans.map((plan, index) => (
          <PlanCard
            key={plan.id || index}
            plan={plan}
            formatMoney={formatMoney}
            buttonColor="green"
            buttonText="Buy Instant"
            onBuy={handleBuyPlan}
            buyingPlanId={buyingPlanId}
          />
        ))}

      </div>
    ) : (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center text-gray-400">
        No instant funding plans available
      </div>
    )}

  </div>

</section>
