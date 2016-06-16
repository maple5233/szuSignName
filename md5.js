module.exports.str2blks_MD5=function(str) {
    let nblk = ((str.length + 8) >> 6) + 1;
    let blks = new Array(nblk * 16);
    for (i = 0; i < nblk * 16; i++)
        blks[i] = 0;
    for (i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks.toString();
};