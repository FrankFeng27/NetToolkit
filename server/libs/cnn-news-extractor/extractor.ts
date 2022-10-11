import * as pupeteer from "puppeteer";
import * as http from "http";
import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import { parseString } from "xml2js";

// extract news from CNN News website
// 1). get robots.txt from http://www.cnn.com/robots.txt
// 2). read robots.txt to get news url
// 3). get url of news.xml from robots.txt
// 4). parse news.xml to get 5 news locations
// 5). access news url with puppeteer
//   5.1). loop all elements filtered with selector ".article__content paragraph"
//   5.2). extract content from the above elements

const download_cnn_robots: (fn: string) => Promise<string> = (fn: string) => {
  return new Promise((resolve, reject) => {
    const cnn_url = "http://www.cnn.com/robots.txt";
    http.get(cnn_url, (res) => {
      const stream = fs.createWriteStream(fn);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(fn);
      });
      stream.on('error', (err: Error) => {
        reject(err);
      });
    });
  });
};

export interface CnnNewsItem {
  newsTitle: string;
  newsLocation: string;
  content?: string;
}

const get_news_xml_url_from_robots_file = (fn: string): string | undefined => {
  const content = fs.readFileSync(fn).toString("utf8");
  const arr = content.split("\n");
  const pattern = /Sitemap:  (.+\/cnn\/news.xml)/;
  for (const ln of arr) {
    const strLine = ln.trim();
    const result = pattern.exec(strLine);
    if (result !== null) {
      return result[1];
    }
  }
  const url = "https://www.cnn.com/sitemaps/cnn/news.xml";
  return url;
};
const get_news_list_from_news_xml = (news_xml_url: string, max_num=5): Promise<Array<CnnNewsItem>> => {
  return new Promise((resolve, reject) => {
    var strXml = "";
    https.get(news_xml_url, (response) => {
      response.on('data', data => {
        strXml += data.toString();
      });
      response.on('end', () => {
        parseString(strXml, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (!result || !result.urlset || !result.urlset.url) {
            reject(new Error("[get_news_list] Error occurred to parse xml string."));
            return;
          }
          const lengthUrls = result.urlset.url.length;
          const lengthReturn = Math.min(max_num, result.urlset.url.length);
          let arr: Array<CnnNewsItem> = [];
          for (let ix = 0, cnt = 0; ix < lengthReturn && cnt < lengthUrls; cnt++) {
            const item = result.urlset.url[ix];
            if (item['news:news'][0]['news:publication'][0]['news:language'][0] !== 'en') {
              continue;
            }
            arr.push({
              newsTitle: item['news:news'][0]['news:title'][0],
              newsLocation: item['loc'][0]
            });
            ix++;
          }

          resolve(arr);
        });
      });
      response.on('err', err => (reject(err)));
    });
  });
};
const sleepForAWhile = (mm: number): Promise<void> => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, mm);
  });
};
const extract_news_from_news_url = async (news: CnnNewsItem): Promise<CnnNewsItem> =>{
  const browser = await pupeteer.launch();
  try {
    const page = await browser.newPage();
    // disable image, font and css request to speed page loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
        req.abort();
      }
      else {
        req.continue();
      }
    });
    await page.goto(news.newsLocation);
    await sleepForAWhile(2000);
    await page.waitForSelector('.article__content');

    const arrParagraph = await page.evaluate(() => {
      const arrParagraph: Array<string> = [];
      const arrElements = document.querySelectorAll(".article__content p.paragraph");
      console.log(`[fengsh] ${arrElements.length}`);
      arrElements.forEach(elem => {
        console.log(`[fengsh] ${elem.innerHTML}`);
        arrParagraph.push(elem.innerHTML);
      });
      return arrParagraph;
    });
    /// const arrParagraph = await page.$$(".article__content p.paragraph");
    /// const content = arrParagraph[0].asElement();
    browser.close();
    news.content = arrParagraph.join("\n");
    return news;
  } catch (err) {
    console.log(err);
    browser.close();
    throw err;
  }
}

export const extractCNNNews = async (tmpFolder: string) => {
  try {
    const robotsFile = path.join(tmpFolder, "robots.txt");
    await download_cnn_robots(robotsFile);
    const newsXml = await get_news_xml_url_from_robots_file(robotsFile);
    if (!newsXml) {
      throw new Error("Failed to parse robots.txt");
    }
    const arrCnnNews = await get_news_list_from_news_xml(newsXml);
    const promises: Array<Promise<CnnNewsItem>> = [];
    arrCnnNews.forEach(item => (
      promises.push(extract_news_from_news_url(item))
    ));
    const results = await Promise.all(promises);
    console.dir(results[0]);
    return results;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
