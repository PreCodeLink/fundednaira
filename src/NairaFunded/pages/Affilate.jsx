import { Link } from "react-router-dom";
import Layout from "../layout/Layout";
import AffiliateHero from "../components/AffiliateHero";
import AffiliateStats from "../components/AffiliateStats";
import AffiliateSections from "../components/AffiliateSections";

const AffiliatePromo = () => {
  return (
   <Layout>
     <AffiliateHero />
     <AffiliateStats />
     <AffiliateSections />
   </Layout>
  );
};

export default AffiliatePromo;