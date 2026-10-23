# AWS landing publishing

The AWS workflow builds pull requests without AWS credentials. Pushes to main and manual runs on main publish to the private bucket ubot-landing-537528034060 and invalidate distribution E2BKWM9LMK1B99. The existing Azure workflow remains active until DNS cutover is reviewed.

## IAM setup

Create the role github-actions-ubot-landing-deploy using landing-trust-policy.json as its custom trust policy. The two exact subjects support GitHub's legacy and immutable OIDC formats for this specific repository and main branch only.

Attach landing-permissions-policy.json as an inline policy named UbotLandingPublish. The role can upload objects and invalidate this distribution; it cannot delete objects, change bucket policies, deploy the backend, or update the distribution.

In Ubotcr/NewLanding repository Settings > Secrets and variables > Actions > Variables, create AWS_ROLE_ARN with arn:aws:iam::537528034060:role/github-actions-ubot-landing-deploy.

## Publication and cutover

1. Review the PR build before merging; this PR does not publish to AWS.
2. Configure IAM and the repository variable before merging or manually running on main.
3. Keep the bucket private with CloudFront OAC and set the distribution default root object to index.html.
4. Upload hashed _astro assets before pages. Retain previous objects so clients with older HTML can finish loading. Obsolete pages also remain until a separately reviewed cleanup.
5. Configure CloudFront routing before DNS cutover: Astro emits per-route HTML; directory routes must resolve to their index.html, /sitemap.xml must map to /sitemap-index.xml, and missing routes must return 404 rather than the homepage. Test the built output to confirm the exact layout.
6. Validate the CloudFront domain, blog routes, missing routes, images, and events API. Configure ACM in us-east-1 and alternate domains for ubotcr.com and www.ubotcr.com.
7. Change Cloudflare DNS only after validation. Disable the Azure deployment in a follow-up PR after cutover.

No resources or DNS are modified by this PR. S3 uploads do not grant public access. Other than the build completed locally during migration, the new workflow must be validated in GitHub Actions before deployment.
