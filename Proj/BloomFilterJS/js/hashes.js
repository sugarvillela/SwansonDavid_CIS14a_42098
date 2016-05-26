/* Dave Swanson 05/14/2016
 * These are hash functions I translated to Javascript
 * jStrHash, djb2, and APHash have been tested by the bloom filter
 * The others may or may not work, depending on js's number
 * system (hashes that use overflow prolly will not work )
 * */
function jStrHash(str){
    var hash = 0;
    var len = str.length;
    for (var i = 0; i < len; i++){
        var ch = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+ch;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash & 0x7FFFFFFF;
}
function djb2( str ){
    var hash = 5381;
    var len = str.length;
    for (var i = 0; i < len; i++){
        var ch = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + ch; /* hash * 33 + c */
    }
    return hash & 0x7FFFFFFF;
}
function APHash( str ){
   var hash = 0xAAAAAAAA;
   var len=str.length;
   for(var i = 0; i < len; i++){
      hash ^= ((i & 1) == 0) ? (  (hash <<  7) ^ str.charCodeAt(i) * (hash >> 3)) :
                               (~((hash << 11) + (str.charCodeAt(i) ^ (hash >> 5))));
   }
   return hash & 0x7FFFFFFF;
}
function JSHash( str ){//works
   var hash = 1315423911;
   var len=str.length;
   for(var i = 0; i < len; i++){
      hash ^= ((hash << 5) + str.charCodeAt(i) + (hash >> 2));
   }
   return hash & 0x7FFFFFFF;
}
function ELFHash( str ){//makes small numbers
   var hash = 0;
   var x    = 0;
   var len=str.length;
   for(var i = 0; i < len; i++){
      hash = (hash << 4) + str.charCodeAt(i);
      x = hash & 0xF0000000;
      if(x != 0){
         hash ^= (x >> 24);
      }
      hash &= ~x;
   }
   return hash & 0x7FFFFFFF;
}
function BKDRHash( str ){//good
   var seed = 131; // 31 131 1313 13131 131313 etc..
   var hash = 0;
   var len=str.length;
   for(var i = 0; i < len; i++){
      hash = (hash * seed) + str.charCodeAt(i);
   }
   return hash & 0x7FFFFFFF;
}
function SDBMHash( str ){//good
   var hash = 0;
   var len=str.length;
   for(var i = 0; i < len; i++)
   {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
   }

   return hash & 0x7FFFFFFF;
}
function DJBHash( str ){//good
   var hash = 5381;
   var len=str.length;
   for(var i = 0; i < len; i++){
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
   }
   return hash & 0x7FFFFFFF;
}
function DEKHash( str ){//good
    var len=str.length;
    var hash = len & 0x7FFFFFFF;
    for(var i = 0; i < len; i++){
        hash = ((hash << 5) ^ (hash >> 27)) ^ str.charCodeAt(i);
    }
    return hash & 0x7FFFFFFF;
}
function BPHash( str ){//good
   var hash = 0;
   var len=str.length;
   for(var i = 0; i < len; i++){
      hash = hash << 7 ^ str.charCodeAt(i);
   }
   return hash & 0x7FFFFFFF;
}
function FNVHash( str ){//good
   var fnv_prime = 0x811C9DC5;
   var hash = 0;
   var len=str.length;
   for(var i = 0; i < len; i++){
      hash *= fnv_prime;
      hash ^= str.charCodeAt(i);
   }
   return hash & 0x7FFFFFFF;
}


