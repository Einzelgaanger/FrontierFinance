import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Building2, TrendingUp, Users } from 'lucide-react';

const LaunchPlusIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-accent">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
              <Building2 className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            LAUNCH+ Capital Facility
          </h1>
          <p className="text-xl text-white/90">
            Accelerating Small Business Growth Funds Across Africa
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">About LAUNCH+</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg leading-relaxed">
            <p>
              <strong>LAUNCH+</strong> is an integrated Mauritius domiciled fund administration platform, 
              structured as a registered Variable Capital Company (VCC) vehicle, developed by the 
              Collaborative for Frontier Finance (CFF) together with its network of Small Business 
              Growth Fund Managers.
            </p>

            <p>
              The platform is designed to accelerate the flow of "fit for purpose" financing to Africa's 
              growth-oriented small businesses - key drivers of job creation and economic resilience. 
              CFF research shows there are now over <strong>100 Small Business Growth Funds (GFs)</strong> aiming 
              to deploy <strong>$2.25bn</strong> in funding to support the growth of Africa's "missing middle," 
              yet to date, these funds have only been able to secure 1/3rd of the institutional and 
              development capital they are targeting.
            </p>

            <p>
              The platform is designed to accelerate cohorts of GFs, providing support needed to refine 
              their investment strategies, attract institutional and development capital and scale more 
              rapidly. By offering cost-efficient shared services, LAUNCH+ ensures world class governance 
              and operational performance.
            </p>
          </CardContent>
        </Card>

        {/* Services Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-accent" />
                <CardTitle className="text-xl">Shared Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Mandatory, Phase I (Partially Subsidized)
              </p>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Shared back-office services (accounting, finance, tax, legal, HR)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Fund administration services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Capacity building and knowledge services</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-success" />
                <CardTitle className="text-xl">Capital Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Optional, Phase II (Repayable)
              </p>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start">
                  <span className="text-success mr-2">•</span>
                  <span>Op-Ex line of credit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-success mr-2">•</span>
                  <span>Warehousing line of credit</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-accent to-accent/80 shadow-2xl">
          <CardContent className="py-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Are You an Early Stage Fund Manager?
            </h2>
            <p className="text-white/95 text-lg mb-8 max-w-3xl mx-auto">
              If you are fundraising with an existing investment vehicle and struggling with 
              fund setup, administration, and achieving first close, we would like to hear from you.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/launch-plus-assessment')}
              className="bg-white text-accent hover:bg-white/90 text-xl px-12 py-6 h-auto shadow-xl"
            >
              Start Questionnaire
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LaunchPlusIntro;