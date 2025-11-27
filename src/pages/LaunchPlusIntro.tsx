import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building2, TrendingUp, Users, Rocket } from 'lucide-react';

const LaunchPlusIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-accent">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm animate-scale-in shadow-2xl">
              <Rocket className="h-20 w-20 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            LAUNCH+ Capital Facility
          </h1>
          <p className="text-2xl text-white/90 font-medium">
            Accelerating Small Business Growth Funds Across Africa
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl mb-8 rounded-3xl border-0 animate-fade-in hover:shadow-white/20 transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="text-4xl text-primary font-bold">About LAUNCH+</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg leading-relaxed">
            <p className="text-muted-foreground">
              <span className="font-bold text-primary">LAUNCH+</span> is an integrated Mauritius domiciled fund administration platform, 
              structured as a registered Variable Capital Company (VCC) vehicle, developed by the 
              Collaborative for Frontier Finance (CFF) together with its network of Small Business 
              Growth Fund Managers.
            </p>

            <p className="text-muted-foreground">
              The platform is designed to accelerate the flow of "fit for purpose" financing to Africa's 
              growth-oriented small businesses - key drivers of job creation and economic resilience. 
              CFF research shows there are now over <span className="font-bold text-accent">100 Small Business Growth Funds (GFs)</span> aiming 
              to deploy <span className="font-bold text-accent">$2.25bn</span> in funding to support the growth of Africa's "missing middle," 
              yet to date, these funds have only been able to secure 1/3rd of the institutional and 
              development capital they are targeting.
            </p>

            <p className="text-muted-foreground">
              The platform is designed to accelerate cohorts of GFs, providing support needed to refine 
              their investment strategies, attract institutional and development capital and scale more 
              rapidly. By offering cost-efficient shared services, LAUNCH+ ensures world class governance 
              and operational performance.
            </p>
          </CardContent>
        </Card>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-full">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary">Shared Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="inline-block mb-4 px-4 py-2 bg-accent/10 rounded-full">
                <p className="text-sm font-semibold text-accent">
                  Mandatory, Phase I (Partially Subsidized)
                </p>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start p-2 rounded-xl hover:bg-accent/5 transition-colors">
                  <span className="text-accent mr-3 text-xl">•</span>
                  <span className="leading-relaxed">Shared back-office services (accounting, finance, tax, legal, HR)</span>
                </li>
                <li className="flex items-start p-2 rounded-xl hover:bg-accent/5 transition-colors">
                  <span className="text-accent mr-3 text-xl">•</span>
                  <span className="leading-relaxed">Fund administration services</span>
                </li>
                <li className="flex items-start p-2 rounded-xl hover:bg-accent/5 transition-colors">
                  <span className="text-accent mr-3 text-xl">•</span>
                  <span className="leading-relaxed">Capacity building and knowledge services</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-success/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary">Capital Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="inline-block mb-4 px-4 py-2 bg-success/10 rounded-full">
                <p className="text-sm font-semibold text-success">
                  Optional, Phase II (Repayable)
                </p>
              </div>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start p-2 rounded-xl hover:bg-success/5 transition-colors">
                  <span className="text-success mr-3 text-xl">•</span>
                  <span className="leading-relaxed">Op-Ex line of credit</span>
                </li>
                <li className="flex items-start p-2 rounded-xl hover:bg-success/5 transition-colors">
                  <span className="text-success mr-3 text-xl">•</span>
                  <span className="leading-relaxed">Warehousing line of credit</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-accent via-accent/90 to-primary shadow-2xl rounded-3xl border-0 animate-fade-in hover:shadow-white/20 transition-all duration-300">
          <CardContent className="py-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Are You an Early Stage Fund Manager?
            </h2>
            <p className="text-white/95 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
              If you are fundraising with an existing investment vehicle and struggling with 
              fund setup, administration, and achieving first close, we would like to hear from you.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/launch-plus-assessment')}
              className="group bg-white text-accent hover:bg-white/90 text-xl px-14 py-7 h-auto shadow-2xl rounded-full font-bold hover:scale-110 transition-all duration-300"
            >
              Start Questionnaire
              <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPlusIntro;