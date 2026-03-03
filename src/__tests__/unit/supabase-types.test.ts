import type { Database, Tables, TablesInsert, TablesUpdate, Enums } from '@/lib/supabase/types'

describe('Supabase Database Types', () => {
  describe('Table definitions', () => {
    it('should define organizations table with required fields', () => {
      const org: Tables<'organizations'> = {
        id: 'test-id',
        name: 'Test Org',
        name_ar: null,
        slug: 'test-org',
        logo_url: null,
        primary_color: null,
        secondary_color: null,
        custom_domain: null,
        default_language: null,
        timezone: null,
        tier_id: null,
        subscription_status: null,
        subscription_start_date: null,
        subscription_end_date: null,
        data_residency: null,
        saudization_enabled: null,
        saudization_target_percentage: null,
        emiratization_enabled: null,
        emiratization_target_percentage: null,
        max_jobs: null,
        max_candidates: null,
        max_users: null,
        created_at: null,
        updated_at: null,
      }
      expect(org.id).toBe('test-id')
      expect(org.name).toBe('Test Org')
      expect(org.slug).toBe('test-org')
    })

    it('should define profiles table with required fields', () => {
      const profile: Tables<'profiles'> = {
        id: 'user-id',
        org_id: null,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: null,
        department: null,
        language_preference: null,
        timezone: null,
        avatar_url: null,
        is_active: true,
        last_login_at: null,
        created_at: null,
        updated_at: null,
      }
      expect(profile.id).toBe('user-id')
      expect(profile.first_name).toBe('John')
      expect(profile.email).toBe('john@example.com')
    })

    it('should define subscription_tiers table', () => {
      const tier: Tables<'subscription_tiers'> = {
        id: 'tier-id',
        name: 'Enterprise',
        name_ar: null,
        description: null,
        description_ar: null,
        price_monthly: 999,
        price_yearly: null,
        currency: 'USD',
        max_jobs: 100,
        max_candidates: 10000,
        max_users: 50,
        max_storage_gb: 100,
        features: null,
        is_active: true,
        sort_order: 1,
        created_at: null,
        updated_at: null,
      }
      expect(tier.price_monthly).toBe(999)
      expect(tier.max_jobs).toBe(100)
    })

    it('should define jobs table with proper enums', () => {
      const job: Tables<'jobs'> = {
        id: 'job-id',
        org_id: 'org-id',
        department_id: null,
        location_id: null,
        title: 'Software Engineer',
        title_ar: null,
        slug: 'software-engineer',
        description: null,
        description_ar: null,
        requirements: null,
        requirements_ar: null,
        responsibilities: null,
        responsibilities_ar: null,
        benefits: null,
        benefits_ar: null,
        job_type: 'full_time',
        experience_level: 'mid',
        status: 'open',
        is_remote: false,
        salary_min: null,
        salary_max: null,
        salary_currency: null,
        show_salary: null,
        education_requirement: null,
        years_experience_min: null,
        years_experience_max: null,
        skills: null,
        languages: null,
        published_at: null,
        closing_date: null,
        positions_count: null,
        is_featured: null,
        allow_internal_applications: null,
        require_cover_letter: null,
        custom_questions: null,
        views_count: null,
        applications_count: null,
        created_by: null,
        hiring_manager_id: null,
        nationality_preference: null,
        saudization_applicable: null,
        created_at: null,
        updated_at: null,
      }
      expect(job.job_type).toBe('full_time')
      expect(job.status).toBe('open')
      expect(job.experience_level).toBe('mid')
    })

    it('should define candidates table', () => {
      const candidate: Tables<'candidates'> = {
        id: 'cand-id',
        org_id: 'org-id',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: null,
        phone_secondary: null,
        headline: null,
        summary: null,
        avatar_url: null,
        city: null,
        country: null,
        nationality: null,
        current_company: null,
        current_title: null,
        years_of_experience: null,
        expected_salary: null,
        salary_currency: null,
        notice_period_days: null,
        skills: null,
        languages: null,
        education: null,
        experience: null,
        certifications: null,
        resume_url: null,
        resume_parsed_data: null,
        linkedin_url: null,
        portfolio_url: null,
        source: 'career_page',
        source_details: null,
        referred_by: null,
        tags: null,
        ai_overall_score: null,
        ai_score_breakdown: null,
        ai_parsed_at: null,
        is_blacklisted: false,
        blacklist_reason: null,
        consent_given: true,
        consent_date: null,
        created_at: null,
        updated_at: null,
      }
      expect(candidate.first_name).toBe('Jane')
      expect(candidate.source).toBe('career_page')
    })

    it('should define audit_logs table', () => {
      const log: Tables<'audit_logs'> = {
        id: 'log-id',
        user_id: null,
        org_id: null,
        action: 'create',
        entity_type: 'organization',
        entity_id: null,
        old_values: null,
        new_values: null,
        ip_address: null,
        user_agent: null,
        metadata: null,
        created_at: null,
      }
      expect(log.action).toBe('create')
      expect(log.entity_type).toBe('organization')
    })
  })

  describe('Insert types', () => {
    it('should allow partial insert for organizations', () => {
      const orgInsert: TablesInsert<'organizations'> = {
        name: 'New Org',
        slug: 'new-org',
      }
      expect(orgInsert.name).toBe('New Org')
    })

    it('should require required fields for profiles insert', () => {
      const profileInsert: TablesInsert<'profiles'> = {
        id: 'user-id',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
      }
      expect(profileInsert.id).toBe('user-id')
    })
  })

  describe('Enum types', () => {
    it('should define valid app roles', () => {
      const roles: Enums<'app_role'>[] = [
        'super_admin',
        'org_admin',
        'hr_manager',
        'recruiter',
        'hiring_manager',
        'interviewer',
      ]
      expect(roles).toHaveLength(6)
    })

    it('should define valid job statuses', () => {
      const statuses: Enums<'job_status'>[] = [
        'draft', 'open', 'paused', 'closed', 'filled',
      ]
      expect(statuses).toHaveLength(5)
    })

    it('should define valid job types', () => {
      const types: Enums<'job_type'>[] = [
        'full_time', 'part_time', 'contract', 'temporary', 'internship', 'freelance',
      ]
      expect(types).toHaveLength(6)
    })

    it('should define valid application statuses', () => {
      const statuses: Enums<'application_status'>[] = [
        'new', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn',
      ]
      expect(statuses).toHaveLength(8)
    })

    it('should define valid candidate sources', () => {
      const sources: Enums<'candidate_source'>[] = [
        'career_page', 'linkedin', 'indeed', 'referral', 'agency', 'direct', 'other',
      ]
      expect(sources).toHaveLength(7)
    })
  })

  describe('Database functions', () => {
    it('should define is_super_admin function type', () => {
      type IsSuperAdminArgs = Database['public']['Functions']['is_super_admin']['Args']
      type IsSuperAdminReturns = Database['public']['Functions']['is_super_admin']['Returns']

      const args: IsSuperAdminArgs = { _user_id: 'some-user-id' }
      expect(args._user_id).toBe('some-user-id')

      const result: IsSuperAdminReturns = true
      expect(result).toBe(true)
    })

    it('should define has_role function type', () => {
      type HasRoleArgs = Database['public']['Functions']['has_role']['Args']

      const args: HasRoleArgs = { _user_id: 'user-id', _role: 'super_admin' }
      expect(args._user_id).toBe('user-id')
      expect(args._role).toBe('super_admin')
    })

    it('should define get_user_org_id function type', () => {
      type GetOrgArgs = Database['public']['Functions']['get_user_org_id']['Args']

      const args: GetOrgArgs = { _user_id: 'user-id' }
      expect(args._user_id).toBe('user-id')
    })
  })
})
