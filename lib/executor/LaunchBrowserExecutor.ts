import puppeteer from "puppeteer";
import { ExecutionEnvironment } from "@/types/executor";
import { LaunchBrowserTask } from "@/lib/workflow/task/LuanchBrowser";

export async function LaunchBrowserExecutor(
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> {
  const webSiteUrl = environment.getInput("Website Url");
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    environment.log.info("Browser launched");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(webSiteUrl);
    environment.setPage(page);
    environment.log.info(`Navigated to ${webSiteUrl}`);
    return true;
  } catch (error: any) {
    environment.log.error(`Error launching browser: ${error.message}`);
    return false;
  }
}
